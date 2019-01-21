import { toast } from 'react-toastify';

export const formatDate = (timestamp) => {
  const d = new Date(timestamp);
  const time = d.toLocaleTimeString('en-US');
  return time.substr(0, 5) + time.slice(-2) + ' | ' + d.toLocaleDateString();
};

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
}

