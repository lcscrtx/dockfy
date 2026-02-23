import { describe, expect, it } from "vitest";
import { generateDocumentMarkdown } from "./documentGenerator";
import { extractTemplateFields } from "../store/templateStore";
import { applyMask } from "./masks";

describe("template field extraction", () => {
  it("extracts unique template variables", () => {
    const markdown = "Olá {{ nome }} e {{cpf}} com {{ nome }}";
    expect(extractTemplateFields(markdown)).toEqual(["nome", "cpf"]);
  });
});

describe("document generation", () => {
  it("replaces known keys and keeps missing values as placeholders", () => {
    const output = generateDocumentMarkdown("locacao_residencial", {
      locador_nome: "Maria",
      locatario_nome: "João",
      locador_cpf_cnpj: "123",
    });

    expect(output).toContain("Maria");
    expect(output).toContain("João");
    expect(output).toContain("_____________________");
  });
});

describe("masks", () => {
  it("formats cpf correctly", () => {
    expect(applyMask("12345678901", "cpf")).toBe("123.456.789-01");
  });
});
