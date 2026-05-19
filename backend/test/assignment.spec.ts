import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { serverOf } from '../src/server'
import * as TodoRepo from '../src/repo/todo'
import { FastifyInstance } from 'fastify'
import mongoose from 'mongoose'

describe('Assignment Test Case: Delete Non-existent Todo', () => {
  let server: FastifyInstance

  beforeAll(async () => {
    server = serverOf()
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  test('When delete a non-existent ID, Then it should response with status code 404 and error message', async () => {
    // [Arrange] Arrange: mock the repo function to return null
    const nonExistentId = new mongoose.Types.ObjectId().toString() 
    vi.spyOn(TodoRepo, 'deleteTodoById').mockImplementation(async () => null as any)

    // [Act] Act: receive a DELETE /api/v1/todos/:id request
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/todos/${nonExistentId}`
    })

    // [Assert] Assert: response should be status code 404
    expect(response.statusCode).toBe(404)

    // Assert: response should have correct error message
    const body = JSON.parse(response.body)
    expect(body).toHaveProperty('msg', `Not Found Todo:${nonExistentId}`)
    
    console.log('Test passed: Correctly handle delete non-existent todo request')
  })
})
