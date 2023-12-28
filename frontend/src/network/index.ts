import { LoginDataType, SignupDataType, UserDto } from "@/types/user";

import { network } from "./utils";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "";

const fetchCors = (url: RequestInfo | URL, init?: RequestInit | undefined) =>
  fetch(url, {
    ...init,
    credentials: "include",
    mode: "cors",
    headers: new Headers({
      "Content-Type": "application/json",
      [process.env.NEXT_PUBLIC_APP_TOKEN_KEY as string]: process.env
        .NEXT_PUBLIC_APP_TOKEN as string,
    }),
  });

const createMethod =
  (method: string) =>
  async <T, B = any>(
    url: RequestInfo | URL,
    init?:
      | (Omit<RequestInit, "body"> & { body: T } & {
          throwError: boolean;
        })
      | undefined
  ) => {
    const response = await fetchCors(baseUrl + url, {
      ...init,
      ...(init && init.body
        ? { body: JSON.stringify(init.body) }
        : { body: null }),
      method,
    });

    network.checkResponse(response, init?.throwError);

    return response.json() as Promise<B>;
  };

const postRequest = createMethod("POST");
const deleteRequest = createMethod("DELETE");
const getRequest = createMethod("GET");
const patchRequest = createMethod("PATCH");

export const api = {
  fetchWithAuthentication: async <Type>(url: string) => {
    const response = await fetchCors(url);

    const { data } = await response.json();

    return data as Type;
  },

  signup: (body: SignupDataType) =>
    postRequest<SignupDataType>("/register", { body, throwError: true }),

  login: (body: LoginDataType) =>
    postRequest<LoginDataType>("/login", { body, throwError: true }),

  getCurrentUser: async () => {
    const data = await getRequest("/user");

    const parsedData = UserDto.parse(data);

    return parsedData;
  },
};
