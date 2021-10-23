import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
	sub: string;
}

export function ensureAuthenticated(
	request: Request,
	response: Response,
	next: NextFunction
) {
	const authToken = request.headers.authorization;
	if (!authToken) {
		return response.status(401).json({
			errorCode: "token.invalid",
		});
	}

	//bearer 1234565
	//[0] bearer
	//[1] 123456

	const [, token] = authToken.split(" ");

	try {
		const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;

		request.user_id = sub;
	} catch (error) {
		return response.status(401).json({
			errorCode: "token.expired",
		});
	}
}
