// store.js

const store = Vuex.createStore({
  state() {
    return {
      openDocuments: {
        documents: {
          openSalesOrders: [],
          openPurchaseOrders: [],
        },
        isLoading: false,
        analyzingProgress: 0,
        lastUpdated: null,
        hasError: false,
      },
    };
  },
  mutations: {
    updateOpenDocuments(state, data) {
      console.log('store: updateOpenDocuments');

      state.openDocuments.documents.openSalesOrders = data.openSalesOrders;
      state.openDocuments.documents.openPurchaseOrders = data.openPurchaseOrders;

      console.log(data);
    },
    updateOpenSalesOrder(state, data) {
      const openSalesOrder = state.openDocuments.documents.openSalesOrders.find((oso) => oso.OrderID === data.orderId);

      if (data.hasOwnProperty('snoozedUntilDate')) {
        openSalesOrder.SnoozedUntilDate = data.snoozedUntilDate;
      }

      if (data.hasOwnProperty('memotext')) {
        openSalesOrder.MemoText = data.memotext;
      }
    },
    updateOpenPurchaseOrder(state, data) {
      const openPurchaseOrder = state.openDocuments.documents.openPurchaseOrders.find((oso) => oso.OrderID === data.orderId);

      if (data.hasOwnProperty('snoozedUntilDate')) {
        openPurchaseOrder.SnoozedUntilDate = data.snoozedUntilDate;
      }

      if (data.hasOwnProperty('memotext')) {
        openPurchaseOrder.MemoText = data.memotext;
      }
    },
  },
  actions: {
    getOpenDocuments({ dispatch, commit, state }) {
      console.log('store: getOpenDocuments');

      if (state.openDocuments.isLoading) {
        return;
      }

      state.openDocuments.analyzingProgress = 0;
      state.openDocuments.hasError = false;
      state.openDocuments.isLoading = true;

      window.axios
        .get('https://api.art.gmbh/app/open-documents?' + Date.now())
        .then((res) => {
          console.log(res);

          const data = res.data.message;

          dispatch('marryOpenDocuments', data).then((res) => {
            commit('updateOpenDocuments', res);

            state.openDocuments.isLoading = false;
            state.openDocuments.lastUpdated = Date.now();
          });
        })
        .catch((err) => {
          state.openDocuments.hasError = true;
          state.openDocuments.isLoading = false;
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    marryOpenDocuments({ state }, data) {
      console.log('store: marryOpenDocuments');

      const openSalesOrders = data.openSalesOrders;
      const openPurchaseOrders = data.openPurchaseOrders;

      return new Promise(async (resolve, reject) => {
        let i = 0;

        console.log('analyzing ' + openSalesOrders.length + ' sales orders');

        // marry them
        for (const salesOrder of openSalesOrders) {
          i++;
          state.openDocuments.analyzingProgress = i / openSalesOrders.length;

          salesOrder.SalesOrderPos.forEach((pos) => {
            if (pos.ProductNumber.startsWith('999')) {
              return false;
            }

            const relevantSalesOrders = openSalesOrders.filter((oso) => {
              return oso.SalesOrderPos.some((sop) => sop.ProductNumber === pos.ProductNumber && sop.Completed1 === 0);
            });

            const relevantPurchaseOrders = openPurchaseOrders.filter((opo) => {
              return opo.PurchaseOrderPos.some((pop) => pop.ProductNumber === pos.ProductNumber && pop.Completed1 === 0);
            });

            let outgoingUntilDeliveryDate = 0;
            let outgoingUntilDeliveryRequestDate = 0;

            relevantSalesOrders.forEach((rso) => {
              // only if is before S/O
              if (new Date(rso.BookingDate) <= new Date(salesOrder.BookingDate)) {
                rso.SalesOrderPos.forEach((rsop) => {
                  if (rsop.ProductNumber === pos.ProductNumber && !rsop.Shipped && rsop.Quantity) {
                    // before delivery date
                    if (new Date(rsop.DeliveryDate) <= new Date(pos.DeliveryDate)) {
                      outgoingUntilDeliveryDate = outgoingUntilDeliveryDate + rsop.Quantity;
                    }

                    // before request date
                    if (new Date(rsop.DeliveryDate) <= new Date(pos.DeliveryRequestDate)) {
                      outgoingUntilDeliveryRequestDate = outgoingUntilDeliveryRequestDate + rsop.Quantity;
                    }
                  }
                });
              }
            });

            // const outgoingUntilDeliveryDate = relevantSalesOrders.reduce((acc, curr) => acc + curr.SalesOrderPos.reduce((acc2, curr2) => acc2 + (curr2.ProductNumber === pos.ProductNumber && new Date(curr2.DeliveryDate) <= new Date(pos.DeliveryDate) && !curr2.Shipped ? curr2.Quantity : 0), 0), 0);
            // const outgoingUntilDeliveryRequestDate = relevantSalesOrders.reduce((acc, curr) => acc + curr.SalesOrderPos.reduce((acc2, curr2) => acc2 + (curr2.ProductNumber === pos.ProductNumber && new Date(curr2.DeliveryDate) <= new Date(pos.DeliveryRequestDate) && !curr2.Shipped ? curr2.Quantity : 0), 0), 0);

            let incomingUntilDeliveryDate = 0;
            let incomingUntilDeliveryRequestDate = 0;

            relevantPurchaseOrders.forEach((rpo) => {
              rpo.PurchaseOrderPos.forEach((rpop) => {
                if (rpop.ProductNumber === pos.ProductNumber && rpop.Quantity) {
                  const incomingQuantity = Math.max(rpop.Quantity - rpop.Delivered, 0);

                  // before delivery date
                  if (new Date(rpop.DeliveryDate) <= new Date(pos.DeliveryDate)) {
                    incomingUntilDeliveryDate = incomingUntilDeliveryDate + incomingQuantity;
                  }

                  // before request date
                  if (new Date(rpop.DeliveryDate) <= new Date(pos.DeliveryRequestDate)) {
                    incomingUntilDeliveryRequestDate = incomingQuantity;
                  }
                }
              });
            });

            // const incomingUntilDeliveryDate = relevantPurchaseOrders.reduce((acc, curr) => acc + curr.PurchaseOrderPos.reduce((acc2, curr2) => acc2 + (curr2.ProductNumber === pos.ProductNumber && new Date(curr2.DeliveryDate) <= new Date(pos.DeliveryDate) ? curr2.Quantity - curr2.Delivered : 0), 0), 0);
            // const incomingUntilDeliveryRequestDate = relevantPurchaseOrders.reduce((acc, curr) => acc + curr.PurchaseOrderPos.reduce((acc2, curr2) => acc2 + (curr2.ProductNumber === pos.ProductNumber && new Date(curr2.DeliveryDate) <= new Date(pos.DeliveryRequestDate) ? curr2.Quantity - curr2.Delivered : 0), 0), 0);

            // delivery status
            const hasShipped = pos.Shipped > 0;
            const isPicked = pos.Picked > 0;
            const deliveryDateBeforeRequestDate = new Date(pos.DeliveryDate) <= new Date(pos.DeliveryRequestDate);
            const deliveryDateAfterRequestDate = !deliveryDateBeforeRequestDate;
            const availableAtDeliveryDate = pos.StockQuantity - Math.max(outgoingUntilDeliveryDate - pos.Quantity, 0) + incomingUntilDeliveryDate;
            const availableAtDeliveryRequestDate = pos.StockQuantity - Math.max(outgoingUntilDeliveryRequestDate - pos.Quantity, 0) + incomingUntilDeliveryRequestDate;

            let deliveryStatus = 666;

            if (hasShipped) {
              deliveryStatus = 0; // Ausgeliefert
            } else if (isPicked) {
              deliveryStatus = 1; // Kommissioniert
            } else if (availableAtDeliveryDate >= pos.Quantity && deliveryDateBeforeRequestDate) {
              deliveryStatus = 2; // Perfekt
            } else if (availableAtDeliveryRequestDate >= pos.Quantity && deliveryDateAfterRequestDate) {
              deliveryStatus = 3; // Wunschtermin erfüllbar
            } else if (availableAtDeliveryDate >= pos.Quantity && deliveryDateAfterRequestDate) {
              deliveryStatus = 4; // Alles OK
            } else {
              deliveryStatus = 5; // Nicht verfügbar
            }

            pos.outgoingUntilDeliveryDate = outgoingUntilDeliveryDate;
            pos.outgoingUntilDeliveryRequestDate = outgoingUntilDeliveryRequestDate;
            pos.incomingUntilDeliveryDate = incomingUntilDeliveryDate;
            pos.incomingUntilDeliveryRequestDate = incomingUntilDeliveryRequestDate;

            pos.availableAtDeliveryDate = availableAtDeliveryDate;
            pos.availableAtDeliveryRequestDate = availableAtDeliveryRequestDate;

            pos.relevantSalesOrders = relevantSalesOrders.map((rso) => rso.OrderNumber);
            pos.relevantPurchaseOrders = relevantPurchaseOrders.map((rpo) => rpo.OrderNumber);

            pos.deliveryStatus = deliveryStatus;
          });

          if (i % 5 === 0 || i === openSalesOrders.length) {
            const ms = i === openSalesOrders.length ? 200 : 0;
            await (() => new Promise((resolve) => setTimeout(resolve, ms)))();
          }
        }

        resolve(data);
      });
    },
    updateOpenDocument({ commit, state }, payload) {
      console.log(payload);

      if (payload.orderNumber.startsWith('AB')) {
        commit('updateOpenSalesOrder', payload);
      } else if (payload.orderNumber.startsWith('BE')) {
        commit('updateOpenPurchaseOrder', payload);
      }

      window.axios
        .post('https://api.art.gmbh/app/open-documents', payload)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
});

export default store;
