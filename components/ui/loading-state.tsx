import { StatePanel } from "@/components/ui/state-panel";

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = "Carregando informacoes",
  description = "Estamos preparando os dados desta pagina para voce.",
  className,
}: LoadingStateProps) {
  return <StatePanel className={className} description={description} title={title} tone="loading" />;
}
