const config = require('../../config');
const axios = require('axios');

/**
 * Gets the order history for a customer
 * @param {Number} customerId Customer id.
 */
const getOrderHistory = (customerId) => {
  if (customerId == null) {
    throw new Error("Customer id is required")
  }

  if (config.wms.enabled) {
    // just to show how you might call the service
    return axios.get(config.wms.endpoint, {
      auth: {
        username: config.wms.username,
        password: config.wms.password    
      }
    })
  }
    // mock implementation while waiting for service.
    // sample simulates an error for dev purposes.
  if (customerId === -100) {
    return Promise.reject({code: 400, message: "Customer id not found"})
  }

  // return a sample mock response.
  return Promise.resolve([
    {
      orderDate: new Date().toUTCString(),
      orderNumber: 1,
      orderStatus: 'Shipped'
    }
  ]);
};

module.exports.getOrderHistory = getOrderHistory;