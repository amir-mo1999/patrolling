export class NetworkError extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

const checkResponse = (response: Response, throwError: boolean = true) => {
  const message = JSON.stringify({
    status: response.status,
    text: response.statusText
  });

  if (throwError && response.status !== 200) {
    throw new NetworkError(message);
  }
};

export const network = {
  checkResponse
};
