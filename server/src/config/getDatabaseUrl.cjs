const getDatabaseUrl = (nodeEnv) => {
  return (
    {
      development: "postgres://postgres:postgres@localhost:5432/serializing_launchers_development",
      test: "postgres://postgres:postgres@localhost:5432/serializing_launchers_test",
    }[nodeEnv] || process.env.DATABASE_URL
  );
};

module.exports = getDatabaseUrl;
