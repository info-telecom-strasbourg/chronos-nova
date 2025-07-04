import { NextResponse } from "next/server";
import {
  getAllInternshipsData,
  getTotalInternshipsCount,
  transformToCardData,
} from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "most-recent";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const data = await getAllInternshipsData(sort, page, limit);
    const transformedData = transformToCardData(data);
    const totalCount = await getTotalInternshipsCount();

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
      totalCount: totalCount,
      hasMore: page * limit < totalCount,
      currentPage: page,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des stages:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Impossible de récupérer les données des stages. Veuillez vérifier la connexion à la base de données.",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}
