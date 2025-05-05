import { addHours, differenceInSeconds, isAfter, isBefore } from "date-fns";
import { REDIS_KEYS } from "../../../config.js";
import { USER_DATA_STATUS } from "../../../utils/constants.js";
import { RedisWrapperST } from "../../../utils/redis.js";
import { LoggerCls } from "../../../utils/logger.js";

const getUserDataKeyPrefix = (userId: string) => {
  return (
    REDIS_KEYS.PREFIX.WRITABLE_APP + REDIS_KEYS.PREFIX.USER_DATA + userId + ":"
  );
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

export { getUserDataKeyPrefix, setUserDataInfo, resetUserDataExpiry };
