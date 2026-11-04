import {createHmac,timingSafeEqual} from "node:crypto";
const secret=()=>process.env.AIRPREP_ADMIN_PASSWORD||"";
const sig=(v)=>createHmac("sha256",secret()).update(v).digest("hex");
export function authorized(req){const pass=secret();if(!pass)return false;const token=req.cookies.get("airprep_admin")?.value||"";const expected="v1."+sig("airprep-admin-v1");return token.length===expected.length&&timingSafeEqual(Buffer.from(token),Buffer.from(expected))}
export function validPassword(value){const pass=secret();return !!pass&&typeof value==="string"&&Buffer.byteLength(value)<=256&&Buffer.byteLength(pass)<=256&&timingSafeEqual(Buffer.from(value.padEnd(256," ")),Buffer.from(pass.padEnd(256," ")))}
export function session(){return "v1."+sig("airprep-admin-v1")}