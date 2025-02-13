import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface IQuestionResult {
    result: object[];
}

export default function QuestionResult({ result }: IQuestionResult) {
    const columns: ColumnDef<object>[] = result.length
        ? Object.keys(result[0]).map((key) => ({
              accessorKey: key,
              id: key + "table",
              cell({ getValue }) {
                  const value = getValue();
                  let cellText = String(value);
                  if (
                      typeof value === "string" &&
                      !!new Date(value).getTime()
                  ) {
                      cellText = dayjs(value).locale("vi").format("DD/MM/YYYY");
                  }

                  return (
                      <Tooltip>
                          <TooltipTrigger>{cellText}</TooltipTrigger>
                          <TooltipContent side="top" align="center">
                              <p>{cellText}</p>
                          </TooltipContent>
                      </Tooltip>
                  );
              },
          }))
        : [];

    const table = useReactTable({
        data: result,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (!columns.length) {
        return (
            <p className="w-full text-center py-10 text-sm text-muted-foreground">
                This query have no result!
            </p>
        );
    }

    return (
        <Table>
            <TableHeader className="">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                <TooltipProvider>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="max-w-[100px] overflow-hidden text-ellipsis"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TooltipProvider>
            </TableBody>
        </Table>
    );
}
