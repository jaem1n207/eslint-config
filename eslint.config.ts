import jaemin from './src/index'

export default jaemin({
  profile: 'migration',
  react: false,
  typescript: true,
  agent: 'warn',
  naming: 'warn',
  ignores: ['dist/**'],
})
