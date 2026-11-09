class InvalidConfigFileError extends Error {
  constructor(message, configName, reason) {
    super(message);
    this.details = { code: 'CONFIG_SYNC_INVALID_FILE', configName, reason };
  }
}

export default InvalidConfigFileError;
