export const navigation = [
  { href: '/', label: 'Dashboard', exact: true },
  { href: '/add', label: 'New Post' , exact: false },
];

export const rpcConfig = {
  protocol: 'http',
  host: 'localhost',
  port: '8545',
}

export const defaults = {
  defaultProfileImageURL: 'http://localhost:3000/images/default-profile-image.png',
}

export default {
  navigation,
  rpcConfig,
  defaults,
};