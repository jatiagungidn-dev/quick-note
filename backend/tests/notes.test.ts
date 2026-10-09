import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("GET /api/notes", () => {
  it("should return all notes", async () => {
    const response = await request(app).get("/api/notes");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("count");
    expect(response.body).toHaveProperty("data");
  });
});

describe("GET /api/notes/:id", () => {
  it("should return a note by id", async () => {
    const created = await request(app)
      .post("/api/notes")
      .send({ content: "Note for GET by id test" });

    const id = created.body.data.id;

    const response = await request(app).get(`/api/notes/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id,
      content: "Note for GET by id test",
    });
  });

  it("should return 404 if note does not exists", async () => {
    const response = await request(app).get("/api/notes/99");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Note not found");
  });

  it("should return 400 for invalid id", async () => {
    const response = await request(app).get(`/api/notes/AAA`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid note id");
  });
});

describe("POST /api/notes", () => {
  it("should create a new note", async () => {
    const response = await request(app)
      .post("/api/notes")
      .send({ content: "Belajar testing QuickNote" });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      content: "Belajar testing QuickNote",
    });
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("created_at");
    expect(response.body.data).toHaveProperty("updated_at");
  });

  it("should reject empty content", async () => {
    const response = await request(app)
      .post("/api/notes")
      .send({ content: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Content cannot be empty");
  });

  it("should reject whitespace only content", async () => {
    const response = await request(app)
      .post("/api/notes")
      .send({ content: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Content cannot be empty");
  });
});

describe("PATCH /api/notes/:id", () => {
  it("should update an existing note", async () => {
    const created = await request(app).post("/api/notes").send({
      content: "Original content",
    });

    const id = created.body.data.id;

    const response = await request(app).patch(`/api/notes/${id}`).send({
      content: "Updated content",
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id,
      content: "Updated content",
    });
  });

  it("should reject empty content", async () => {
    const created = await request(app).post("/api/notes").send({
      content: "Note to update",
    });

    const id = created.body.data.id;

    const response = await request(app).patch(`/api/notes/${id}`).send({
      content: "   ",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Content cannot be empty");
  });

  it("should return 404 if note does not exist", async () => {
    const response = await request(app).patch("/api/notes/999999").send({
      content: "Updated content",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Note not found");
  });

  it("should return 400 for an invalid id", async () => {
    const response = await request(app).patch("/api/notes/abc").send({
      content: "Updated content",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid note id");
  });
});

describe("DELETE /api/notes/:id", () => {
  it("should delete an existing note", async () => {
    const created = await request(app).post("/api/notes").send({
      content: "Note to delete",
    });

    const id = created.body.data.id;

    const response = await request(app).delete(`/api/notes/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Note deleted successfully");
  });

  it("should return 404 if note does not exist", async () => {
    const response = await request(app).delete("/api/notes/999999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Note not found");
  });

  it("should return 400 for an invalid id", async () => {
    const response = await request(app).delete("/api/notes/abc");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid note id");
  });
});
