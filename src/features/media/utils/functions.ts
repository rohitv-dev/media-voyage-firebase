import { formatDate } from "@utils/functions";
import { unparse } from "papaparse";
import { CSVMedia, Media } from "../types/media";

export const downloadCsv = (data: Media[]) => {
  const parsedData: CSVMedia[] = data.map((m) => ({
    Title: m.title,
    Status: m.status.valueOf(),
    Type: m.type.valueOf(),
    Rating: m.rating,
    "Added On": formatDate(m.createdAt),
    "Last Updated On": formatDate(m.updatedAt),
    "Started On": m.startDate ? formatDate(m.startDate) : undefined,
    "Completed On": m.completedDate ? formatDate(m.completedDate) : undefined,
    Platform: m.platform,
    Tags: m.tags,
    Genre: m.genre,
    Recommended: m.recommended,
    Comments: m.comments,
  }));

  const csvData = unparse(parsedData, {
    columns: [
      "Title",
      "Status",
      "Type",
      "Rating",
      "Added On",
      "Last Updated On",
      "Started On",
      "Completed On",
      "Platform",
      "Tags",
      "Genre",
      "Recommended",
      "Comments",
    ],
  });

  const csvBlob = new Blob([csvData], { type: "text/csv" });
  const csvURL = URL.createObjectURL(csvBlob);
  const link = document.createElement("a");
  link.href = csvURL;
  link.download = `media-voyage-${formatDate(new Date())}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
