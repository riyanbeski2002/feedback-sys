import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, AlertCircle, ExternalLink } from "lucide-react"

interface FlaggedHotel {
  id: string
  name: string
  location: string
  avg_score: number
  total_feedbacks: number
}

interface FlaggedHotelsTableProps {
  hotels: FlaggedHotel[]
}

export function FlaggedHotelsTable({ hotels }: FlaggedHotelsTableProps) {
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 px-6">Hotel Name</TableHead>
            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 px-6">Location</TableHead>
            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 px-6 text-center">Avg Score</TableHead>
            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 px-6 text-center">Total Feedbacks</TableHead>
            <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 px-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <AlertCircle className="size-10 opacity-10" />
                  <p className="text-sm font-medium">No flagged hotels at the moment.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            hotels.map((hotel) => (
              <TableRow key={hotel.id} className="group border-b last:border-0 hover:bg-muted/30 transition-colors">
                <TableCell className="font-bold text-sm py-4 px-6">{hotel.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs font-medium py-4 px-6">{hotel.location}</TableCell>
                <TableCell className="text-center py-4 px-6">
                  <span className="font-black text-destructive bg-destructive/10 px-2.5 py-1 rounded-md text-xs">
                    {hotel.avg_score.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-center font-bold text-sm py-4 px-6">{hotel.total_feedbacks}</TableCell>
                <TableCell className="text-right py-4 px-6">
                  <Button variant="ghost" size="sm" className="rounded-full h-8 px-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Review</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
