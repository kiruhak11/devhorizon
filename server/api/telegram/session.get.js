import { eventHandler, getCookie } from "h3";
import { useRuntimeConfig } from "#internal/nitro";
import * as crypto from "node:crypto";
const handleUnauthorized = () => {
  return {
    loggedIn: false,
    status: 401,
    message: "Unauthorized",
  };
};
export default eventHandler(async (event) => {
  try {
    const session = getCookie(event, "tg_user");
    const runtimeConfig = useRuntimeConfig(event);
    if (!session) return handleUnauthorized();
    const decodedCookie = JSON.parse(atob(session));
    if (Date.now() / 1e3 - decodedCookie.auth_date > 86400)
      return handleUnauthorized();
    const telegramApiToken = "7696869877:AAHYLtyjbqbSSjhWrFBVLeLMis6kWtwaIK8";
    const secret = crypto
      .createHash("sha256")
      .update(telegramApiToken)
      .digest();
    let dataCheckString = [];
    for (let key in decodedCookie)
      if (key != "hash") dataCheckString.push(key + "=" + decodedCookie[key]);
    const check_hash = crypto
      .createHmac("sha256", secret)
      .update(dataCheckString.sort().join("\n"))
      .digest("hex");
    return {
      loggedIn: check_hash == decodedCookie.hash,
      ...decodedCookie,
    };
  } catch (err) {
    console.error("Telegram Auth - ", err);
    return {
      loggedIn: false,
      status: 500,
      body: "Internal Server Error",
    };
  }
});
