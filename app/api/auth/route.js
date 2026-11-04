import {NextResponse} from "next/server";import {authorized,validPassword,session} from "../../../lib/auth";
export const runtime="nodejs";export async function GET(req){return NextResponse.json({authenticated:authorized(req)})}
export async function POST(req){let data;try{data=await req.json()}catch{return NextResponse.json({error:"Invalid request"},{status:400})}
if(!validPassword(data.password))return NextResponse.json({error:"Incorrect password or admin access not configured"},{status:401});
const res=NextResponse.json({ok:true});res.cookies.set("airprep_admin",session(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:60*60*12});return res}
export async function DELETE(){const res=NextResponse.json({ok:true});res.cookies.set("airprep_admin","",{httpOnly:true,path:"/",maxAge:0});return res}