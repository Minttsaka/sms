import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if(!id){
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 })
    }

    // Get classes for user's institution(s)
    const classes = await prisma.class.findMany({
      where: {
        institutionId: id,
      },
      include: {
        _count: {
          select: {
            students: true,
            teachers: true,
          },
        },
      },
    })

    // Transform data to include counts
     const classesWithCounts = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      section: cls.section,
      academicYear: cls.academicYear,
      capacity: cls.capacity,
      roomNumber: cls.roomNumber,
      studentCount: cls._count.students,
      teacherCount: cls._count.teachers,
    }))

    return NextResponse.json({ classes: classesWithCounts })
  } catch (error) {
    console.error("[v0] Fetch classes error:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const { institutionId, name, section, academicYear, capacity, roomNumber } = body

    // // Verify user has access to this institution
    // if (!user.institutionIds.includes(institutionId)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    // }

    // Check if class already exists
    const existingClass = await prisma.class.findFirst({
      where: {
        institutionId,
        name,
        section: section || "",
        academicYear,
      }
    })

    if (existingClass) {
      return NextResponse.json(
        { error: "A class with this name and section already exists for this academic year" },
        { status: 409 },
      )
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        section: section || "",
        academicYear,
        capacity: capacity || null,
        roomNumber: roomNumber || null,
        institution:{
          connect: { id: institutionId }
        }
      },
    })

    return NextResponse.json({ success: true, class: newClass })
  } catch (error) {
    console.error("[v0] Create class error:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
