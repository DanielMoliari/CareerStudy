import type { SkillContentMap } from '@/types'
import nodeJs from './node-js'
import typeorm from './typeorm'
import nestjs from './nestjs'
import graphql from './graphql'
import prisma from './prisma'
import concurrency from './concurrency'
import cachingStrategies from './caching-strategies'
import apiVersioning from './api-versioning'
import laravel from './laravel'
import express from './express'
import python from './python'
import fastify from './fastify'
import restApis from './rest-apis'
import websocket from './websocket'
import swagger from './swagger'
import drizzle from './drizzle'
import sequelize from './sequelize'
import jwt from './jwt'
import oauth20 from './oauth-2-0'
import nextauthAuthJs from './nextauth-auth-js'
import bullmq from './bullmq'
import rabbitmq from './rabbitmq'
import apacheKafka from './apache-kafka'
import cdcDebezium from './cdc-debezium'
import bash from './bash'
import php from './php'
import eloquent from './eloquent'
import sanctum from './sanctum'
import firebaseAuth from './firebase-auth'
import socketIo from './socket-io'
import webhooks from './webhooks'
import apacheThrift from './apache-thrift'
import fhirHl7 from './fhir-hl7'
import agoraIo from './agora-io'
import stripe from './stripe'
import mercadoPago from './mercado-pago'
import resend from './resend'
import leaflet from './leaflet'
import openstreetmap from './openstreetmap'
import revitPython from './revit-python'
import go from './go'
import rust from './rust'

const backend: SkillContentMap = {
  'node-js': nodeJs,
  'typeorm': typeorm,
  'nestjs': nestjs,
  'graphql': graphql,
  'prisma': prisma,
  'concurrency': concurrency,
  'caching-strategies': cachingStrategies,
  'api-versioning': apiVersioning,
  'laravel': laravel,
  'express': express,
  'python': python,
  'fastify': fastify,
  'rest-apis': restApis,
  'websocket': websocket,
  'swagger': swagger,
  'drizzle': drizzle,
  'sequelize': sequelize,
  'jwt': jwt,
  'oauth-2-0': oauth20,
  'nextauth-auth-js': nextauthAuthJs,
  'bullmq': bullmq,
  'rabbitmq': rabbitmq,
  'apache-kafka': apacheKafka,
  'cdc-debezium': cdcDebezium,
  'bash': bash,
  'php': php,
  'eloquent': eloquent,
  'sanctum': sanctum,
  'firebase-auth': firebaseAuth,
  'socket-io': socketIo,
  'webhooks': webhooks,
  'apache-thrift': apacheThrift,
  'fhir-hl7': fhirHl7,
  'agora-io': agoraIo,
  'stripe': stripe,
  'mercado-pago': mercadoPago,
  'resend': resend,
  'leaflet': leaflet,
  'openstreetmap': openstreetmap,
  'revit-python': revitPython,
  'go': go,
  'rust': rust,
}

export default backend
