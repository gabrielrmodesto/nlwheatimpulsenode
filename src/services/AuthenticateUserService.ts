import axios from "axios";

interface IAcesssTokenResponse {
	access_token: string;
}
interface IUserResponse {
	avart_url: string;
	login: string;
	id: number;
	name: string;
}
class AuthenticateUserService {
	async execute(code: string) {
		const url = "https://github.com/login/oauth/access_token";

		//quando vier vai esta como esse nome de access token
		const { data: accessTokenResponse } =
			await axios.post<IAcesssTokenResponse>(url, null, {
				params: {
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code,
				},
				headers: {
					Accept: "application/json",
				},
			});

		const response = await axios.get<IUserResponse>("https://api.github.com/user", {
			headers: {
				authorization: `Bearer ${accessTokenResponse.access_token}`,
			},
		});

		return response.data;
	}
}

export { AuthenticateUserService };
