import { RedisWrapperST } from "../../../utils/redis.js";
import { USER_DATA_STATUS } from "../../../utils/constants.js";

import { pgGenerateNewUserData } from "./pg-generate-new-user-data.js";
import { resetUserDataExpiry, setUserDataInfo } from "./user-data-config.js";
import { REDIS_KEYS } from "../../../config.js";

interface IUserInfo {
  userId?: string;
  userDataStatus?: string;
}

const getUnusedUserId = async () => {
  let userId = "";

  const infoFilePattern =
    REDIS_KEYS.PREFIX.WRITABLE_APP +
    REDIS_KEYS.PREFIX.USER_DATA +
    "*" +
    ":" +
    REDIS_KEYS.LABELS.USER_INFO;
  const redisWrapperST = RedisWrapperST.getInstance();
  const searchJsonKeys = await redisWrapperST.getAllKeys(infoFilePattern);

  if (searchJsonKeys && searchJsonKeys.length > 0) {
    for (const searchKey of searchJsonKeys) {
      const userData: IUserInfo = (await redisWrapperST.client?.json.get(
        searchKey
      )) as any;

      if (
        userData &&
        userData.userDataStatus === USER_DATA_STATUS.UNUSED &&
        userData.userId
      ) {
        userId = userData.userId;
        break;
      }
    }
  }

  return userId;
};

const pgGetNewUserId = async () => {
  let userId = await getUnusedUserId();

  if (!userId) {
    //generate new userId + new user data
    let result = await pgGenerateNewUserData({
      isAll: true,
    });
    userId = result.userId;
  }
  if (userId) {
    await setUserDataInfo(
      userId,
      REDIS_KEYS.LABELS.USER_INFO_DATA_STATUS,
      USER_DATA_STATUS.ACTIVE
    );
    await resetUserDataExpiry(userId);
  }

  //(async) generate new user data to maintain pool of unused userIds
  pgGenerateNewUserData({
    isAll: true,
  });

  return userId;
};

export { pgGetNewUserId };
