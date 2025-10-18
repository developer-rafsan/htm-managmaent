import { NextResponse } from "next/server";
import mongoose from 'mongoose';

// mongo db uri
const MONGODB_URI  = 'mongodb://localhost:27017/htm-managmaent';

export async function DBconnect() {
  try {
    mongoose.connect(MONGODB_URI as string);
    const connection = mongoose.connection;

    // check mongodb connected
    connection.on('connectrd', ()=> {
      return NextResponse.json(
        { message: "Database Connect Successful" },
        { status: 200 }
      );
    })

    // if connected error massage
    connection.on('error', ()=> {
      return NextResponse.json(
        { message: "Database Connect Faild Please Check The URI" },
        { status: 500 }
      )
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}