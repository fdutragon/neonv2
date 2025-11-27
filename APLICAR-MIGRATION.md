# Como Aplicar a Migration para Adicionar Combustível "Flex"

## Opção 1: Via Supabase Dashboard (RECOMENDADO)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Cole o seguinte SQL:

```sql
-- Add 'flex' as a valid fuel type option
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_fuel_type_check;

ALTER TABLE vehicles ADD CONSTRAINT vehicles_fuel_type_check 
  CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'flex'));
```

6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Você verá a mensagem "Success. No rows returned"

## Opção 2: Via SQL direto no projeto

Se você tem acesso direto ao banco de dados PostgreSQL, execute:

```bash
psql -h <seu-host>.supabase.co -U postgres -d postgres
```

Depois cole o SQL acima.

## Verificar se funcionou

Após aplicar a migration, teste cadastrando um veículo com combustível "Flex" no sistema.

## O que essa migration faz?

- Remove a constraint antiga que só aceitava: gasoline, diesel, electric
- Adiciona nova constraint que aceita: gasoline, diesel, electric, **flex**
- Não afeta dados existentes
- Permite cadastrar novos veículos com combustível "Flex"

---

**Arquivo da migration:** `supabase/migrations/20250127_add_flex_fuel_type.sql`
