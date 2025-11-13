import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    if(!id){
      return NextResponse.json({ error: "Institution ID is required" }, { status: 400 })
    }

    const teachers = await prisma.teacherOnInstitution.findMany({
      where: {
        institutionId: id,
      },
      include: {
        teacher:{
          include: {
            classes: true,
            user:true
          },
        },
      },
      orderBy: {
        teacher:{
          user: {
            firstName: "asc",
          },
        },
      },
    })

    return NextResponse.json({ teachers })
  } catch (error) {
    console.error("[v0] Fetch teachers error:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Request body:", body);
    const {
      institutionId,
      firstName,
      middleName,
      lastName,
      email,
      dateOfBirth,
      phone,
      employeeNumber,
      subjects,
      qualification,
      experience,
      salary,
      joinDate,
    } = body
    
    const existingTeacher = await prisma.teacher.findFirst({
        where: {
          firstName,
          middleName,
          lastName,
          employeeNumber
        },
      })

      if (existingTeacher) {
        return NextResponse.json({ error: "A teacher with this employee number already exists" }, { status: 409 })
      }

      if(email){
        const defaultPassword = generateRandomPassword(10);

        console.log("Generated password for new teacher:", defaultPassword);

        const password = await bcrypt.hash(defaultPassword, 10);

        const createUser = await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            password: password,
            role: "TEACHER",
            phone: phone || null,
          },
        })

        // FIXED: Removed institution connection from teacher.create()
        const newTeacher = await prisma.teacher.create({
          data: {
            user: {
              connect: { id: createUser.id },
            },
            // ✅ Removed the direct institution connection
            firstName,
            middleName,
            lastName,
            phone: phone,
            employeeNumber: employeeNumber,
            subjects: subjects || [],
            qualification: qualification,
            experience: experience,
            salary: salary,
            joinDate: joinDate ? new Date(joinDate) : null,
          },
        })

        console.log("New teacher created with user account:", newTeacher);

        // ✅ This is the correct way to connect teacher to institution
        await prisma.teacherOnInstitution.create({
          data:{
            institution:{
              connect:{
                id: institutionId
              }
            },
            teacher:{
              connect:{
                id: newTeacher.id
              }
            }
          }
        })

        return NextResponse.json({ success: true, teacher: newTeacher })

      } else {
        // FIXED: Also removed institution connection from the no-email path
        const newTeacher = await prisma.teacher.create({
          data: {
            // ✅ Removed the direct institution connection
            firstName,
            middleName,
            lastName,
            phone: phone || null,
            employeeNumber: employeeNumber || null,
            subjects: subjects || [],
            qualification: qualification || null,
            experience: experience || null,
            salary: salary || null,
            joinDate: joinDate ? new Date(joinDate) : null,
          },
        })

        // ✅ This is the correct way to connect teacher to institution
        await prisma.teacherOnInstitution.create({
          data:{
            institution:{
              connect:{
                id: institutionId
              }
            },
            teacher:{
              connect:{
                id: newTeacher.id
              }
            }
          }
        })

         return NextResponse.json({ success: true, teacher: newTeacher })
      }
  
  } catch (error) {
    console.error("[v0] Create teacher error:", error)
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
  }
}

function generateRandomPassword(
  length: number,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true
): string {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let allowedChars = "";
  if (includeLowercase) allowedChars += lowercaseChars;
  if (includeUppercase) allowedChars += uppercaseChars;
  if (includeNumbers) allowedChars += numberChars;
  if (includeSymbols) allowedChars += symbolChars;

  if (allowedChars.length === 0) {
    throw new Error("At least one character type must be selected.");
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    password += allowedChars[randomIndex];
  }

  return password;
}