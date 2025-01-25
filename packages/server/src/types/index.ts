

export type Project = {
id: string,
name: string
}

export type User = {
id: string,
email: string,
projects: Project[]
}

export type Article = {
id: string,
title: string,
body: string,
project_id: string,
path: string,
user: User
}

export type BaseResponse = {
ok: boolean,
error: string | null
}

export type ArticlesCreateRequest = {
title: string,
body: string,
project_id?: string
}

export type UserIdentityResponse = {
ok: boolean,
error: string | null,
user?: User
}

export type SignInWithAuthCodeResponse = {
ok: boolean,
error: string | null,
access_token: string | null
}

export type ArticlesInfoResponse = {
ok: boolean,
error: string | null,
article?: Article
}

export type ArticlesListResponse = {
ok: boolean,
error: string | null,
articles: Article[]
}

export type ArticlesCreateResponse = {
ok: boolean,
error: string | null,
article?: Article
}

// Based on: swagger-typescript-api
export interface ApiResponse {
  /** @format int32 */
  code?: number;
  type?: string;
  message?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export enum ApiErrorTypes {
  AuthenticationError = 'AuthenticationError',
  ForbiddenError = 'ForbiddenError',
  NotFoundError = 'NotFoundError',
  UnprocessableError = 'UnprocessableError',
  InternalError = 'InternalError',
  ConnectionError = 'ConnectionError'
}

export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, message: string, code: string, isConnectionError = false) {
    super(message)
    this.status = status
    this.code = code

    if (isConnectionError) {
      this.name = ApiErrorTypes.ConnectionError
    } else {
      switch (status) {
        case 401:
          this.name = ApiErrorTypes.AuthenticationError
          break
        case 403:
          this.name = ApiErrorTypes.ForbiddenError
          break
        case 404:
          this.name = ApiErrorTypes.NotFoundError
          break
        case 422:
          this.name = ApiErrorTypes.UnprocessableError
          break
        default:
          this.name = ApiErrorTypes.InternalError
      }
    }
  }
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:3001/api/v1/";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();

  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      } as Record<string, string>,
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T>({
                                              body,
                                              secure,
                                              path,
                                              type,
                                              query,
                                              format,
                                              baseUrl,
                                              cancelToken,
                                              ...params
                                            }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      let responseApiError: ApiError | null = null;

      const data =
        !responseFormat || response.status == 204
          ? null
          : await response[responseFormat]()
            .then((data) => {
              if (!response.ok) {
                responseApiError = new ApiError(response.status, data?.message, data?.code);
              }
              return data;
            })
            .catch((e) => {
              responseApiError = new ApiError(response.status, "Something went wrong", e?.code ?? "");
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (responseApiError != null) {
        throw responseApiError;
      }

      if (!response.ok) throw data;
      return data
    }).catch((e) => {
      if (e.name === "TypeError" && e.message === "Failed to fetch") {
        throw new ApiError(0, "Failed to fetch", "TypeError", true);
      }

      throw e;
    });
  };
}

export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  users = {
  identity: (data: any, params: RequestParams = {}) =>
    this.request<UserIdentityResponse>({
    path: 'users.identity',
    method: "POST",
    body: data,
    secure: true,
    type: ContentType.Json,
    format: "json",
    ...params,
}),
};
auth = {
  send_auth_code: (data: {email: string}, params: RequestParams = {}) =>
    this.request<BaseResponse>({
    path: 'auth.send_auth_code',
    method: "POST",
    body: data,
    secure: true,
    type: ContentType.Json,
    format: "json",
    ...params,
}),
sign_in_with_auth_code: (data: {auth_code: string}, params: RequestParams = {}) =>
    this.request<SignInWithAuthCodeResponse>({
    path: 'auth.sign_in_with_auth_code',
    method: "POST",
    body: data,
    secure: true,
    type: ContentType.Json,
    format: "json",
    ...params,
}),
};
articles = {
  create: (data: ArticlesCreateRequest, params: RequestParams = {}) =>
    this.request<ArticlesCreateResponse>({
    path: 'articles.create',
    method: "POST",
    body: data,
    secure: true,
    type: ContentType.Json,
    format: "json",
    ...params,
}),
list: (data: {project_id: string}, params: RequestParams = {}) =>
    this.request<ArticlesListResponse>({
    path: 'articles.list',
    method: "POST",
    body: data,
    secure: true,
    type: ContentType.Json,
    format: "json",
    ...params,
}),
info: (data: {project_id?: string, id: string}, params: RequestParams = {}) =>
    this.request<ArticlesInfoResponse>({
    path: 'articles.info',
    method: "POST",
    body: data,
    secure: true,
    type: ContentType.Json,
    format: "json",
    ...params,
}),
};
}