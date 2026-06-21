'use strict';

/**
 * Config do agente New Relic (CommonJS — requerido pelo loader ESM).
 * Ative com NEW_RELIC_LICENSE_KEY no ambiente (ECS task definition).
 */
exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'Planit Go API'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || '',
  logging: {
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info',
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'response.headers.setCookie*',
    ],
  },
};
