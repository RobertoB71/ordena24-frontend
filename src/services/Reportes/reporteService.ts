import { ApiServices } from "../API/apiServices";

export class ReporteServices extends ApiServices {
  private path = "/api/reportes";

  public descargarReportePedidos = (estado?: string) => {
    return this.instance.get<Blob>(`${this.path}/pedidos/pdf`, {
      params: estado ? { estado } : undefined,
      responseType: "blob",
    });
  };
}

export const ReporteInstance = new ReporteServices();
