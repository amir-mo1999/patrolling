class Api {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  }
  private async makeRequest(
    endpoint: string,
    method: string,
    body?: any
  ): Promise<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // You can handle different types of responses (JSON, text, etc.) based on your backend
      return await response.json();
    } catch (error: any) {
      console.error("API Error:", error.message);
      throw error;
    }
  }

  async getAllScenarios(): Promise<any> {
    const endpoint = "/get-all-scenarios";
    const method = "GET";
    try {
      const response = await this.makeRequest(endpoint, method);
      return response;
    } catch (error) {
      // Handle error or propagate it to the calling code
      throw error;
    }
  }
}
const api = new Api();

export default api;
