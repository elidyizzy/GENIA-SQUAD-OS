# Guideline: Testing Patterns

> Principios para suites de teste confiaveis.

## Piramide de Testes

```
        /\          E2E (Poucos)
       /  \         Fluxos criticos
      /----\
     /      \       Integration (Alguns)
    /--------\      API, DB queries
   /          \
  /------------\    Unit (Muitos)
                    Funcoes, classes
```

## Padrao AAA

| Etapa | Proposito |
|-------|-----------|
| **Arrange** | Configurar dados de teste |
| **Act** | Executar codigo sob teste |
| **Assert** | Verificar resultado |

## Selecao de Tipo de Teste

| Tipo | Melhor Para | Velocidade |
|------|-------------|------------|
| **Unit** | Funcoes puras, logica | Rapido (<50ms) |
| **Integration** | API, DB, servicos | Medio |
| **E2E** | Fluxos criticos do usuario | Lento |

## Principios de Unit Test

### Bons Unit Tests (FIRST)

| Principio | Significado |
|-----------|-------------|
| Fast | < 100ms cada |
| Isolated | Sem deps externos |
| Repeatable | Mesmo resultado sempre |
| Self-checking | Sem verificacao manual |
| Timely | Escritos com o codigo |

### O Que Testar

| Testar | Nao Testar |
|--------|------------|
| Business logic | Codigo do framework |
| Edge cases | Libs de terceiros |
| Error handling | Getters simples |

## Principios de Integration Test

### O Que Testar

| Area | Foco |
|------|------|
| API endpoints | Request/response |
| Database | Queries, transactions |
| External services | Contratos |

### Setup/Teardown

| Fase | Acao |
|------|------|
| Before All | Conectar recursos |
| Before Each | Resetar estado |
| After Each | Limpar |
| After All | Desconectar |

## Principios de Mocking

### Quando Fazer Mock

| Mock | Nao Mock |
|------|----------|
| External APIs | Codigo sob teste |
| Database (unit) | Dependencias simples |
| Time/random | Funcoes puras |
| Network | Stores in-memory |

### Tipos de Mock

| Tipo | Uso |
|------|-----|
| Stub | Retornar valores fixos |
| Spy | Rastrear chamadas |
| Mock | Definir expectativas |
| Fake | Implementacao simplificada |

## Organizacao de Testes

### Naming

| Padrao | Exemplo |
|--------|---------|
| Should behavior | "should return error when..." |
| When condition | "when user not found..." |
| Given-when-then | "given X, when Y, then Z" |

### Agrupamento

| Nivel | Uso |
|-------|-----|
| describe | Agrupar testes relacionados |
| it/test | Caso individual |
| beforeEach | Setup comum |

## Dados de Teste

### Estrategias

| Abordagem | Uso |
|-----------|-----|
| Factories | Gerar dados de teste |
| Fixtures | Datasets predefinidos |
| Builders | Criacao fluente de objetos |

### Principios
- Usar dados realistas
- Randomizar valores nao essenciais (faker)
- Compartilhar fixtures comuns
- Manter dados minimos

## Best Practices

| Pratica | Por que |
|---------|---------|
| Um assert por teste | Razao clara de falha |
| Testes independentes | Sem dependencia de ordem |
| Testes rapidos | Rodar frequentemente |
| Nomes descritivos | Auto-documentacao |
| Limpar | Evitar side effects |

## Anti-Patterns

| NAO Fazer | Fazer |
|-----------|-------|
| Testar implementacao | Testar comportamento |
| Duplicar codigo de teste | Usar factories |
| Setup complexo | Simplificar ou dividir |
| Ignorar testes flaky | Corrigir causa raiz |
| Pular cleanup | Resetar estado |

## Exemplo de Teste

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@test.com' };

      // Act
      const user = await userService.createUser(userData);

      // Assert
      expect(user.id).toBeDefined();
      expect(user.name).toBe('John');
    });

    it('should throw error when email is invalid', async () => {
      // Arrange
      const userData = { name: 'John', email: 'invalid' };

      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects.toThrow('Invalid email');
    });
  });
});
```

> **Lembrar:** Testes sao documentacao. Se alguem nao consegue entender o que o codigo faz pelos testes, reescreva-os.
