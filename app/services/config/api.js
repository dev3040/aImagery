import nextConfig from "@/next.config";
export const GetCaption = () =>
  `${nextConfig.API_URL}/caption`;

export const ValidateUser = (id) =>
  `http://aimageryapi.project-demo.info:3004/v1/users/${id}`

export const Login = () =>
  `http://aimageryapi.project-demo.info:3004/v1/auth/login`

export const SignUp = () =>
  `${nextConfig.API_URL}/signup`

export const Emotion = () =>
  `${nextConfig.API_URL}/emotion`

export const CheckServer = () =>
  `${nextConfig.API_URL}`