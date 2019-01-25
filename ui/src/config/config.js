/**
 * Configuration for dynamic navigation
 */
export const navigation = [
  { href: '/', label: 'Dashboard', exact: true },
  { href: '/add', label: 'New Post' , exact: false },
];

/**
 * RPC connection details
 */
export const rpcConfig = {
  protocol: 'http',
  host: 'localhost',
  port: '8545',
}

/**
 * Default profile image URL
 */
export const defaults = {
  defaultProfileImageURL: 'http://localhost:3000/images/default-profile-image.png',
}

export default {
  navigation,
  rpcConfig,
  defaults,
};