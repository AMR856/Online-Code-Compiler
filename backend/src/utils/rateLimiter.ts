import rateLimit from "express-rate-limit";

export const jobIDLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  standardHeaders: true,   
  legacyHeaders: false,     
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

export const codeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    status: 429,
    error: "Code execution rate limit exceeded.",
  },
});
