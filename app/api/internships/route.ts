import { NextResponse } from "next/server";
import { getAllInternshipsData, transformToCardData } from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'most-recent';
    
    const data = await getAllInternshipsData(sort);
    const transformedData = transformToCardData(data);
    
    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des stages:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Impossible de récupérer les données des stages. Veuillez vérifier la connexion à la base de données.",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}
