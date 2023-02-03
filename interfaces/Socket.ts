//
// Interface des attributs des sockets.
// 	Source : https://stackoverflow.com/a/74060659
//
import type { NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";
import type { Socket as NetSocket } from "net";
import type { Server as HTTPServer } from "http";

export interface SocketServer extends HTTPServer
{
	io?: IOServer;
}

export interface SocketWithIO extends NetSocket
{
	server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse
{
	socket: SocketWithIO;
}