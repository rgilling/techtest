const { expect } = require('chai')
const wms = require('../../lib/services/wms');
const config = require('../../config');

const { getOrderHistory } = wms;

describe("WMS API", () => {
  it('should be configured', () => {
    expect(config.wms.endpoint).to.not.be.empty;
    expect(config.wms.username).to.not.be.empty;
    expect(config.wms.password).to.not.be.empty;
    expect(config.wms.enabled).to.equal(false);
  });

  it("should return a suitable result when mock mode is active", async () => {
    const orderHistory = await getOrderHistory(12345);
    expect(orderHistory).to.be.an('array');
    expect(orderHistory).to.not.be.empty;
    orderHistory.every((order) => {
      expect(order).to.have.keys(['orderNumber', 'orderStatus', 'orderDate']);
      expect(order.orderDate).to.be.a('string');
      expect(order.orderNumber).to.be.a('number');
      expect(isNaN(Date.parse(order.orderDate))).to.be.false;
    });
  });

  it("should fail when no customer id", async () => {
    try {
      await getOrderHistory();
    } catch (err) {
      expect(err.message).to.equal("Customer id is required");
      return;
    }
    // required for negative test
    expect(false).to.equal(true, 'wms must throw');
  });

  it("should fail when the service simulates a fault", async () => {
    try {
      await getOrderHistory(-100);
    } catch (err) {
      expect(err).to.deep.equal({code: 400, message: 'Customer id not found'})
      return; // this is important
    }
    expect(false).to.equal(true);
  });
});
