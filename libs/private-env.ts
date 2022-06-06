const Private = {
  MONGO_URL: process.env.MONGO_URL!,
};

Object.keys(Private).forEach((key) => {
  const value = Private[key as keyof typeof Private] as string | undefined;
  if (value === undefined) {
    throw new Error(`Environment variable '${key}' must be defined`);
  }
});

export { Private };
