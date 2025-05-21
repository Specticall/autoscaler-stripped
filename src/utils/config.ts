if (!process.env.PORT) {
  throw new Error("Env was not loaded properly");
}

export const PORT = process.env.PORT || "8000";
export const UIS_HOST = process.env.UIS_HOST || "";
export const UIS_USERNAME = process.env.UIS_USERNAME || "";
export const UIS_PASSWORD = process.env.UIS_PASSWORD || "";
