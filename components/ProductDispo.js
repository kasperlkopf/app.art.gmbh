// ProductDispo.js

import SharedMethods from '/components/SharedMethods.js';

const template = `
  <table class="table m-0">
    <thead>
      <tr>
        <th scope="col">Belegdatum</th>
        <th scope="col">Beleg</th>
        <th scope="col" colspan="2">Kunde / Lieferant</th>
        <th scope="col">Termin</th>
        <th class="text-end" scope="col">Menge</th>
        <th class="text-end" scope="col">Lagerbestand</th>
      </tr>
    </thead>
    <tbody>
      <tr class="bg-light">
        <td colspan="6">Lagerbestand</td>
        <td class="text-end">{{ formatNumbersLocal(stockQuantity) }}</td>
      </tr>
      <tr v-for="(pos, index) in orderItems" :key="index">
        <td>{{ formatDate(pos.bookingDate) }}</td>
        <td class="text-truncate">
          <span v-if="pos.movementType === 'outgoing'" class="d-inline-block bg-primary rounded-circle" style="width: 0.5em; height: 0.5em"></span>
          <span v-else class="d-inline-block bg-warning rounded-circle" style="width: 0.5em; height: 0.5em"></span>
          <span class="ms-2">{{ pos.orderNumber }}</span>
        </td>
        <td>{{ pos.accountNumber }}</td>
        <td>{{ pos.matchcode }}</td>
        <td>{{ formatDate(pos.deliveryDate) }}</td>
        <td class="text-end">{{ formatNumbersLocal(pos.quantity) }}</td>
        <td class="text-end">{{ formatNumbersLocal(pos.stockRemainder) }}</td>
      </tr>
    </tbody>
  </table>
`;

export default {
  name: 'ProductDispo',
  props: ['product'],
  mixins: [SharedMethods],
  data() {
    //
  },
  computed: {
    relevantOrders() {
      const relevantSalesOrders = this.$store.state.openDocuments.documents.openSalesOrders.filter((oso) => {
        return oso.SalesOrderPos.some((sop) => sop.ProductNumber === this.product.ProductNumber && sop.Completed1 === 0);
      });

      const relevantPurchaseOrders = this.$store.state.openDocuments.documents.openPurchaseOrders.filter((opo) => {
        return opo.PurchaseOrderPos.some((pop) => pop.ProductNumber === this.product.ProductNumber && pop.Completed1 === 0);
      });

      const allRelevantOrders = [...relevantSalesOrders, ...relevantPurchaseOrders];

      return allRelevantOrders;
    },
    sortedRelevantOrders() {
      return this.relevantOrders.slice(0).sort((a, b) => {
        return new Date(a.BookingDate) - new Date(b.BookingDate);
      });
    },
    orderItems() {
      const allOrderItems = [];

      this.$store.state.openDocuments.documents.openSalesOrders.forEach((so) => {
        so.SalesOrderPos.forEach((sop) => {
          if (sop.ProductNumber === this.product.ProductNumber && sop.Completed1 === 0) {
            allOrderItems.push({
              bookingDate: so.BookingDate,
              orderNumber: so.OrderNumber,
              accountNumber: so.CustomerNumber,
              matchcode: so.Matchcode,
              deliveryDate: sop.DeliveryDate,
              deliveryRequestDate: sop.DeliveryRequestDate,
              quantity: sop.Quantity,
              stockQuantity: sop.StockQuantity,
              movementType: 'outgoing',
            });
          }
        });
      });

      this.$store.state.openDocuments.documents.openPurchaseOrders.forEach((po) => {
        po.PurchaseOrderPos.forEach((pop) => {
          if (pop.ProductNumber === this.product.ProductNumber && pop.Completed1 === 0) {
            allOrderItems.push({
              bookingDate: po.BookingDate,
              orderNumber: po.OrderNumber,
              accountNumber: po.SupplierNumber,
              matchcode: po.Matchcode,
              deliveryDate: pop.DeliveryDate,
              deliveryRequestDate: pop.DeliveryRequestDate,
              quantity: pop.Quantity,
              movementType: 'incoming',
            });
          }
        });
      });

      // sort
      const sortedOrderItems = allOrderItems.sort((a, b) => {
        return new Date(a.deliveryDate) - new Date(b.deliveryDate);
      });

      let stockRemainder = allOrderItems.find((el) => el.movementType === 'outgoing').stockQuantity;

      // add stock info
      const supplementedOrderItems = sortedOrderItems.map((soi) => {
        if (soi.movementType === 'outgoing') {
          stockRemainder = stockRemainder - soi.quantity;
        } else if (soi.movementType === 'incoming') {
          stockRemainder = stockRemainder + soi.quantity;
        }

        soi.stockRemainder = stockRemainder;

        return soi;
      });

      return supplementedOrderItems;
    },
    stockQuantity() {
      return this.orderItems.find((el) => el.movementType === 'outgoing').stockQuantity;
    },
  },
  template,
};
