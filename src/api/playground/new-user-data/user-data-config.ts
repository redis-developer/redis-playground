import type { IRedisCommandPattern } from "../../../utils/constants.js";

import { addHours, differenceInSeconds, isAfter, isBefore } from "date-fns";

import { REDIS_KEYS } from "../../../config.js";
import { RedisWrapperST, splitQuery } from "../../../utils/redis.js";
import { LoggerCls } from "../../../utils/logger.js";
import {
  REDIS_READ_COMMANDS,
  REDIS_WRITE_COMMANDS,
  USER_DATA_STATUS,
} from "../../../utils/constants.js";

const verifyCommandPrefix = (command: string, checkPrefix: string) => {
  let isPrefixExists = false;
  let isWriteCmd = false;
  let isReadCmd = false;
  let checkedKeys: string[] = [];
  let cmdPattern: IRedisCommandPattern | undefined;

  if (command && checkPrefix) {
    const parts = splitQuery(command);
    if (parts.length) {
      let cmd = parts[0].toUpperCase();
      let twoWordCmd =
        parts.length > 1
          ? `${parts[0].toUpperCase()} ${parts[1].toUpperCase()}`
          : null;

      const hasPrefix = (key: string): boolean => {
        let retVal = false;

        if (typeof key === "string" && key.startsWith(checkPrefix)) {
          retVal = true;
          checkedKeys.push(key);
        }

        return retVal;
      };

      const CHECK_COMMANDS = [...REDIS_WRITE_COMMANDS, ...REDIS_READ_COMMANDS];

      isWriteCmd = !!REDIS_WRITE_COMMANDS.find(
        (c) => c.command === cmd || c.command === twoWordCmd
      );

      isReadCmd = !!REDIS_READ_COMMANDS.find(
        (c) => c.command === cmd || c.command === twoWordCmd
      );

      cmdPattern = CHECK_COMMANDS.find(
        (c) => c.command === cmd || c.command === twoWordCmd
      );

      //special commands with different key positions (keyPattern)
      let specialCmd = CHECK_COMMANDS.find(
        (c) => (c.command === cmd || c.command === twoWordCmd) && c.keyPattern
      );

      if (specialCmd && specialCmd.keyPattern) {
        const pattern = specialCmd.keyPattern;
        const matchPatternToStop = specialCmd.matchPatternToStop;

        const shouldStopOnPattern = (val: string) =>
          matchPatternToStop &&
          matchPatternToStop.some((pat) =>
            typeof pat === "string" ? val === pat : pat.test(val)
          );

        if (pattern.type === "none") {
          isPrefixExists = true;
        } else if (pattern.type === "step" && pattern.start && pattern.step) {
          isPrefixExists = true;
          for (let i = pattern.start; i < parts.length; i += pattern.step) {
            if (shouldStopOnPattern(parts[i])) {
              break;
            }
            if (!hasPrefix(parts[i])) {
              isPrefixExists = false;
              break;
            }
          }
        } else if (pattern.type === "from" && pattern.start) {
          isPrefixExists = true;
          for (let i = pattern.start; i < parts.length; i++) {
            if (shouldStopOnPattern(parts[i])) {
              break;
            }
            if (!hasPrefix(parts[i])) {
              isPrefixExists = false;
              break;
            }
          }
        } else if (
          pattern.type === "indexes" &&
          Array.isArray(pattern.indexes)
        ) {
          isPrefixExists = true;
          for (let idx of pattern.indexes) {
            if (!hasPrefix(parts[idx])) {
              isPrefixExists = false;
              break;
            }
          }
        }
      } else {
        const cmdObj = CHECK_COMMANDS.find((c) => c.command === cmd);
        const twoWordCmdObj = CHECK_COMMANDS.find(
          (c) => c.command === twoWordCmd
        );
        if (cmdObj) {
          //regular commands have key at index 1
          isPrefixExists = hasPrefix(parts[1]);
        } else if (twoWordCmdObj) {
          //twoWord commands have key at index 2
          isPrefixExists = hasPrefix(parts[2]);
        }
      }
    }
  }
  return {
    isPrefixExists,
    isWriteCmd,
    isReadCmd,
    checkedKeys,
    cmdPattern,
  };
};

const getUserDataKeyPrefix = (userId: string) => {
  return (
    REDIS_KEYS.PREFIX.WRITABLE_APP + REDIS_KEYS.PREFIX.USER_DATA + userId + ":"
  );
};

const replaceKeyPrefixInQuery = (query: string, userId?: string) => {
  if (query && userId) {
    const userAppKeyPrefix =
      getUserDataKeyPrefix(userId) + REDIS_KEYS.PREFIX.APP;
    const appKeyPrefix = REDIS_KEYS.PREFIX.APP;

    query = query.replace(new RegExp(appKeyPrefix, "g"), userAppKeyPrefix);
  }
  return query;
};

const replaceKeyPrefixInResult = (result: any, userId?: string): any => {
  if (result && userId) {
    const userAppKeyPrefix =
      getUserDataKeyPrefix(userId) + REDIS_KEYS.PREFIX.APP;
    const appKeyPrefix = REDIS_KEYS.PREFIX.APP;

    const replaceInStringFn = (str: string) =>
      str.replace(new RegExp(userAppKeyPrefix, "g"), appKeyPrefix);

    if (typeof result === "string") {
      return replaceInStringFn(result);
    } else if (Array.isArray(result)) {
      return result.map((item) => replaceKeyPrefixInResult(item, userId));
    }
  }
  return result;
};

const setUserDataInfo = async (userId: string, prop: string, value: string) => {
  try {
    const redisWrapperST = RedisWrapperST.getInstance();
    const userDataKeyPrefix = getUserDataKeyPrefix(userId);
    const key = userDataKeyPrefix + REDIS_KEYS.LABELS.USER_INFO;

    const exists = await redisWrapperST.client?.exists(key);
    if (!exists) {
      await redisWrapperST.client?.json.set(key, "$", {});
    }
    const keyPath = `$.${prop}`;
    await redisWrapperST.client?.json.set(key, keyPath, value);
  } catch (error) {
    LoggerCls.error(`Error in setUserDataInfo() for userId: ${userId}`, error);
    throw error;
  }
};

const _setUserDataExpiry = async (userId: string) => {
  try {
    const redisWrapperST = RedisWrapperST.getInstance();
    const userDataKeyPrefix = getUserDataKeyPrefix(userId);

    const expiryHours = REDIS_KEYS.EXPIRY.USER_DATA_EXPIRY_IN_HOURS;
    const slideExpiryAfterHours =
      expiryHours * (REDIS_KEYS.EXPIRY.SLIDE_EXPIRY_IN_PERCENT / 100);
    const currentDate = new Date();
    const futureExpiryDate = addHours(currentDate, expiryHours);
    const slideExpiryDate = addHours(currentDate, slideExpiryAfterHours);

    //set expiry timestamps
    await redisWrapperST.client?.set(
      userDataKeyPrefix + REDIS_KEYS.LABELS.EXPIRY_TIMESTAMP,
      futureExpiryDate.toISOString()
    );
    await redisWrapperST.client?.set(
      userDataKeyPrefix + REDIS_KEYS.LABELS.EXTEND_EXPIRY_IF_ACCESSED_AFTER,
      slideExpiryDate.toISOString()
    );

    //set TTL on user data
    const ttlKeyPattern = userDataKeyPrefix + "*";
    const ttlKeys = await redisWrapperST.getAllKeys(ttlKeyPattern);
    if (ttlKeys && ttlKeys.length > 0) {
      const ttlSeconds = differenceInSeconds(futureExpiryDate, currentDate);
      await redisWrapperST.setExpiry(ttlKeys, ttlSeconds);
    }
  } catch (error) {
    LoggerCls.error(
      `Error in setUserDataExpiry() for userId: ${userId}`,
      error
    );
    throw error;
  }
};

const isUserDataActive = async (userId: string) => {
  let isActive = false;
  const redisWrapperST = RedisWrapperST.getInstance();
  const userDataKeyPrefix = getUserDataKeyPrefix(userId);
  const key = userDataKeyPrefix + REDIS_KEYS.LABELS.USER_INFO;

  const userInfo: any = await redisWrapperST.client?.json.get(key);
  const prop = REDIS_KEYS.LABELS.USER_INFO_DATA_STATUS;
  if (
    userInfo &&
    prop in userInfo &&
    userInfo[prop] === USER_DATA_STATUS.ACTIVE
  ) {
    isActive = true;
  }
  return isActive;
};

const resetUserDataExpiry = async (userId: string) => {
  let isReset = false;
  const redisWrapperST = RedisWrapperST.getInstance();
  const userDataKeyPrefix = getUserDataKeyPrefix(userId);

  const currentDate = new Date();

  const expiryTimestamp = await redisWrapperST.get(
    userDataKeyPrefix + REDIS_KEYS.LABELS.EXPIRY_TIMESTAMP
  );
  const extendExpiryTimestamp = await redisWrapperST.get(
    userDataKeyPrefix + REDIS_KEYS.LABELS.EXTEND_EXPIRY_IF_ACCESSED_AFTER
  );

  if (expiryTimestamp && extendExpiryTimestamp) {
    const futureExpiryDate = new Date(expiryTimestamp);
    const slideExpiryDate = new Date(extendExpiryTimestamp);

    if (
      isAfter(currentDate, slideExpiryDate) &&
      isBefore(currentDate, futureExpiryDate)
    ) {
      await _setUserDataExpiry(userId);
      isReset = true;
    }
  } else {
    //first time setting expiry
    await _setUserDataExpiry(userId);
    isReset = true;
  }
  return isReset;
};

export {
  getUserDataKeyPrefix,
  setUserDataInfo,
  resetUserDataExpiry,
  replaceKeyPrefixInQuery,
  replaceKeyPrefixInResult,
  verifyCommandPrefix,
  isUserDataActive,
};
