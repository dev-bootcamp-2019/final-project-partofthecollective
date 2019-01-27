/**
 * imports
 */
import { toast } from 'react-toastify';

/**
 * helper method formatDate
 * @param timestamp
 * @returns {string}
 */
export const formatDate = (timestamp) => {
  const d = new Date(timestamp);
  const time = d.toLocaleTimeString('en-US');
  return time.substr(0, 5) + time.slice(-2) + ' | ' + d.toLocaleDateString();
};

/**
 * helper method notify - toastify
 * @param message
 * @param type
 */
export const notify = (message, type) =>  {
  const toastifySettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };
  switch(type) {
    case 'error':
      toast.error(message, toastifySettings);
      break;

    case 'success':
      toast.success(message, toastifySettings);
      break;

    default:
      toast.info(message, toastifySettings);
  }
};

/**
 * tipAuthor async method
 * @param web3
 * @param from
 * @param to
 * @returns {Promise.<void>}
 */
export const tipAuthor = async (web3, from, to) => {
  if (from === to) {
    notify('You can not tip yourself, because you are the author :)', 'error');
  } else {
    let tx = await web3.eth.sendTransaction({
      from: from,
      to: to,
      value: web3.utils.toWei(".0010", "ether")
    });
    if (tx && tx.transactionHash) {
      notify(`Tip sent to author at: ${to}`, 'success');
    }
  }
};

