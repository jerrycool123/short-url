const Public = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
};

Object.keys(Public).forEach((key) => {
  const value = Public[key as keyof typeof Public] as string | undefined;
  if (value === undefined) {
    throw new Error(`Environment variable '${key}' must be defined`);
  }
});

export { Public };
