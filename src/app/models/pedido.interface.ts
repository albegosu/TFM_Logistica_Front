
export interface Pedido {
    idPedido: number;
    numero_pedido: string;
    fecha_creacion: Date;
    almacen_origen: string;
    almacen_destino: string;
    fecha_entrega: Date;
    usuario_asignado: number;
    usuario_responsable: number;
    estado: number;
    id_transporte:string;
    detalle_pedido:string;
}
