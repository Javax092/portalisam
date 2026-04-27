import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { categoryOptions, priorityOptions, statusOptions } from "@/lib/community";

type ReportsFiltersProps = {
  category?: string;
  status?: string;
  priority?: string;
  query?: string;
  neighborhood?: string;
};

export function ReportsFilters({
  category = "",
  status = "",
  priority = "",
  query = "",
  neighborhood = "",
}: ReportsFiltersProps) {
  return (
    <form className="grid gap-3 xl:grid-cols-[1.15fr_1fr_1fr_1fr_1fr_auto]">
      <Input defaultValue={query} name="query" placeholder="Buscar por titulo, descricao ou localizacao" />

      <Select defaultValue={category} name="category">
        <option value="">Todas as categorias</option>
        {categoryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select defaultValue={status} name="status">
        <option value="">Todos os status</option>
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select defaultValue={priority} name="priority">
        <option value="">Todas as prioridades</option>
        {priorityOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Input defaultValue={neighborhood} name="neighborhood" placeholder="Filtrar por bairro ou comunidade" />

      <Button className="w-full" type="submit" variant="secondary">
        <Search className="h-4 w-4" />
        Filtrar
      </Button>
    </form>
  );
}
