import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  // Access the query parameter 'id' from the incoming request URL
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  console.log("Fetching institution with ID:", id);

  if (!id) {
    return NextResponse.json({ error: 'Institution ID is required' }, { status: 400 });
  }

  const institutionData = await prisma.institution.findUnique({
    where:{
      id
    }
  })

  console.log("Institution data retrieved:", institutionData);
  if (institutionData) {
    return NextResponse.json(institutionData);
  } else {
    return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
  }

}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Request body:", body);
    const {
      institutionName,
      institutionType,
      address,
      city,
      country,
      phone,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminPassword,
      adminConfirmPassword,
    } = body;

    // Validation
    if (
      !institutionName ||
      !institutionType ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !adminFirstName ||
      !adminLastName ||
      !adminEmail ||
      !adminPassword
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (adminPassword !== adminConfirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Check if user exists
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    // If user doesn’t exist, create new one
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      adminUser = await prisma.user.create({
        data: {
          firstName: adminFirstName,
          lastName: adminLastName,
          email: adminEmail,
          dateOfBirth: new Date(), // Placeholder, adjust as needed
          password: hashedPassword,
          role: "ADMIN",
        },
      });
    }

    // Now create the institution and connect the admin
    const newinstitution = await prisma.institution.create({
      data: {
        name: institutionName,
        institutionType: institutionType,
        address,
        state:"MALAWI",
        email: adminEmail,
        city,
        country,
        phone,
      },
    });

    await prisma.usersOnInstitution.create({
      data: {
        user: {
          connect: { id: adminUser.id },
        },
        institution: {
          connect: { id: newinstitution.id },
        },
      },
    });

    return NextResponse.json(
      { success: true, institution: newinstitution },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering institution:", error);
    return NextResponse.json(
      { error: "Failed to register institution." },
      { status: 500 }
    );
  }
}
