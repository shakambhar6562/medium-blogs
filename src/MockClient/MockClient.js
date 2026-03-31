class MockClient {
  availableEnpoints = {
    productList: '/productList',
  };
  mockData = new Map([
    [
      this.availableEnpoints.productList,
      [
        {
          id: 'a3f9c2d1-7b4e-4f8a-9c12-1e5d8b7f2a90',
          name: 'Quantum Wireless Headphones',
          price: 129.99,
        },
        {
          id: 'b7e1d4c9-2a6f-4d3b-8c45-9f2a1e6d7b33',
          name: 'Smart LED Desk Lamp',
          price: 39.49,
        },
        {
          id: 'c2d8a7f1-5e9b-4a6c-b321-4f7d9e2a6c88',
          name: 'Portable Bluetooth Speaker',
          price: 59.99,
        },
        {
          id: 'd9a4e6b2-1c3f-4d7e-9a55-2b8c7e1f4d66',
          name: 'Ergonomic Office Chair',
          price: 199.0,
        },
        {
          id: 'e6f1c3a8-8d2b-4b9f-a123-7c5d2e9f1a44',
          name: 'Stainless Steel Water Bottle',
          price: 24.75,
        },
      ],
    ],
  ]);
  timerId = null;
  constructor(newMockData) {
    if (newMockData && newMockData instanceof Map) {
      this.mockData = new Map([...newMockData]);
      this.GET = this.GET.bind(this);
    }
  }

  prepareSuccessResponse({ status = 200, data = null, message }) {
    return {
      status,
      message,
      data,
    };
  }

  prepareErrorResponse({ status = 200, error = null, message }) {
    return {
      status,
      message,
      error,
    };
  }

  async GET({
    mockEndpoint = '',
    errorMessage = 'Something went wrong',
    sleepTimer = 300,
    status = 200,
    reject = false,
    error = null,
    message = 'Success',
  }) {
    if (!mockEndpoint || !this.mockData.has(mockEndpoint)) return;

    const data = this.mockData.get(mockEndpoint);

    return new Promise((res, rej) => {
      const timerId = setTimeout(() => {
        clearTimeout(timerId);
        if (reject) {
          rej(
            this.prepareErrorResponse({
              message: errorMessage,
              status: status > 300 ? status : 500,
              error,
            })
          );
        } else {
          res(
            this.prepareSuccessResponse({
              message,
              data,
              status: status >= 200 && status < 300 ? status : 200,
            })
          );
        }
      }, sleepTimer);
    });
  }
}

export const newClient = MockClient;
export const defaultClient = new MockClient();
