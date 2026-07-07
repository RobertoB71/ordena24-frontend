import type { ReactNode } from "react";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  emptyMessage: string;
  getRowKey: (item: T) => string | number;
}

export default function AdminTable<T>({
  columns,
  data,
  emptyMessage,
  getRowKey,
}: AdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-orange-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-100 text-left">
          <thead className="bg-orange-50/70">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-5 py-4 text-xs font-black uppercase tracking-wide text-stone-500 ${
                    column.className ?? ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={getRowKey(item)} className="transition hover:bg-orange-50/40">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-4 text-sm text-stone-700 ${
                        column.className ?? ""
                      }`}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-sm font-medium text-stone-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
