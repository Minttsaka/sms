import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Type definitions for enrollment data
interface GuardianData {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship?: string
  occupation?: string
  isPrimaryContact?: boolean
  isEmergencyContact?: boolean
}

interface DocumentData {
  id: string
  type: string
  name: string
  url: string
  uploadDate: string
}

interface EnrollmentData {
  // Basic Information
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth?: string
  gender?: string
  address?: string
  phone?: string
  email?: string
  
  // Academic Information
  gradeApplying?: string
  academicYear?: string
  classId?: string
  
  // Biometric Data
  fingerprintEnrolled?: boolean
  fingerprintData?: any
  
  // Documents and Photo
  documents?: DocumentData[]
  photo?: string
  
  // Guardian Information
  guardians?: GuardianData[]
  
  // Additional Information
  bloodGroup?: string
  medicalConditions?: string
  allergies?: string
  medications?: string
  nationality?: string
  religion?: string
  languagesSpoken?: string[]
  specialNeeds?: string
  transportRequired?: boolean
  
  // Previous School
  previousSchool?: string
  previousGrade?: string
  transferReason?: string
  
  // Institution
  institutionId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: EnrollmentData = await request.json()

    console.log("Enrollment request body:", body)
    
    const {
      institutionId,
      firstName,
      middleName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      gradeApplying,
      academicYear,
      classId,
      fingerprintEnrolled,
      fingerprintData,
      documents,
      photo,
      guardians,
      bloodGroup,
      medicalConditions,
      allergies,
      medications,
      nationality,
      religion,
      languagesSpoken,
      specialNeeds,
      transportRequired,
      previousSchool,
      previousGrade,
      transferReason,
    } = body

    // Validate required fields
    if (!institutionId || !firstName || !lastName) {
      return NextResponse.json({ 
        error: "Institution ID, first name, and last name are required" 
      }, { status: 400 })
    }

    // Generate admission number
    const admissionNumber = await generateAdmissionNumber(institutionId)

    // If email is provided for student, check if it exists
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (existingUser) {
        return NextResponse.json({ 
          error: "A user with this email already exists" 
        }, { status: 409 })
      }
    }

    // Process guardian data - create parent records
    let createdParents: any[] = []
    if (guardians && guardians.length > 0) {
      for (const guardian of guardians) {
        // Check if guardian email exists
        const existingGuardian = await prisma.user.findUnique({
          where: { email: guardian.email.toLowerCase() },
        })

        if (!existingGuardian && guardian.email) {
          // Create guardian user account
          const guardianPassword = generateRandomPassword(10)
          const hashedPassword = await bcrypt.hash(guardianPassword, 10)

          const guardianUser = await prisma.user.create({
            data: {
              email: guardian.email.toLowerCase(),
              firstName: guardian.firstName,
              lastName: guardian.lastName,
              password: hashedPassword,
              role: "PARENT",
              phone: guardian.phone || null,
              dateOfBirth: new Date(), // Default date
            },
          })

          // Create parent profile
          const parent = await prisma.parent.create({
            data: {
              institutionId,
              firstName: guardian.firstName,
              middleName: null,
              lastName: guardian.lastName,
              email: guardian.email,
              phone: guardian.phone,
              relationship: guardian.relationship || "Guardian",
              occupation: guardian.occupation || null,
              isPrimaryContact: guardian.isPrimaryContact || false,
              isEmergencyContact: guardian.isEmergencyContact || false,
            },
          })

            await prisma.userToParent.create({
            data: {
              user: {
                connect: { id: guardianUser.id }
              },
              parent: {
                connect: { id: parent.id }
              },
            },
          })

          createdParents.push(parent)
          console.log("Created guardian with password:", guardianPassword)
        }
      }
    }

    // Create student with comprehensive data
    let newStudent: any

    if (email) {
      // Create student with user account
      const result = await prisma.$transaction(async (tx) => {
        // Generate password for student
        const studentPassword = generateRandomPassword(10)
        const hashedPassword = await bcrypt.hash(studentPassword, 10)

        // Create user account
        const newUser = await tx.user.create({
          data: {
            email: email.toLowerCase(),
            firstName,
            middleName: middleName || null,
            lastName,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
            password: hashedPassword,
            role: "STUDENT",
            phone: phone || null,
          },
        })

        // Create student profile with all enrollment data
        const student = await tx.student.create({
          data: {
            user: {
              connect: { id: newUser.id },
            },
            institution: {
              connect: { id: institutionId },
            },
            firstName,
            middleName: middleName || null,
            lastName,
            admissionNumber,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender: gender || null,
            address: address || null,
            phone: phone || null,
            email: email || null,
            
            // Academic Information
            gradeApplying: gradeApplying || null,
            academicYear: academicYear || null,
            class: {
              connect: classId ? { id: classId } : undefined
            },
            
            // Biometric Data
            fingerprintEnrolled: fingerprintEnrolled || false,
            fingerprintData: fingerprintData || null,
            
            photo: photo || null,
            
            // Guardian Information (as JSON)
            guardians:{
              create: createdParents.map(parent => ({
                parentId: parent.id,
                relationship: guardians?.find(g => g.email === parent.email)?.relationship || "Guardian",
                isPrimaryContact: guardians?.find(g => g.email === parent.email)?.isPrimaryContact || false,
                isEmergencyContact: guardians?.find(g => g.email === parent.email)?.isEmergencyContact || false,
              }))
            },
            
            // Additional Information
            bloodGroup: bloodGroup || null,
            medicalConditions: medicalConditions || null,
            allergies: allergies || null,
            medications: medications || null,
            nationality: nationality || null,
            religion: religion || null,
            languagesSpoken: languagesSpoken || [],
            specialNeeds: specialNeeds || null,
            transportRequired: transportRequired || false,
            
            // Previous School
            previousSchool: previousSchool || null,
            previousGrade: previousGrade || null,
            transferReason: transferReason || null,
            
            // Enrollment Status
            enrollmentStatus: "enrolled",
            enrollmentDate: new Date(),
            
            // Link parents if created
            parentIds: createdParents.map(p => p.id),
          },
        })

        console.log("Student created with password:", studentPassword)
        return { student, studentPassword }
      })

      newStudent = result.student
    } else {
      // Create student without user account
      newStudent = await prisma.student.create({
        data: {
          institution: {
            connect: { id: institutionId },
          },
          firstName,
          middleName: middleName || null,
          lastName,
          admissionNumber,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender: gender || null,
          address: address || null,
          phone: phone || null,
          
          // Academic Information
          gradeApplying: gradeApplying || null,
          academicYear: academicYear || null,
          class:{
            connect: classId ? { id: classId } : undefined
          },
          
          // Biometric Data
          fingerprintEnrolled: fingerprintEnrolled || false,
          fingerprintData: fingerprintData || null,
          
          photo: photo || null,
          
          // Guardian Information
          guardians:{
            connect: createdParents.map(parent => ({ id: parent.id }))
          },
          
          // Additional Information
          bloodGroup: bloodGroup || null,
          medicalConditions: medicalConditions || null,
          allergies: allergies || null,
          medications: medications || null,
          nationality: nationality || null,
          religion: religion || null,
          languagesSpoken: languagesSpoken || [],
          specialNeeds: specialNeeds || null,
          transportRequired: transportRequired || false,
          
          // Previous School
          previousSchool: previousSchool || null,
          previousGrade: previousGrade || null,
          transferReason: transferReason || null,
          
          // Enrollment Status
          enrollmentStatus: "enrolled",
          enrollmentDate: new Date(),
          
          // Link parents if created
          parentIds: createdParents.map(p => p.id),
        },
      })
    }

    console.log("Student enrollment completed:", newStudent)

    return NextResponse.json({ 
      success: true, 
      student: newStudent,
      admissionNumber,
      message: "Student enrolled successfully",
      guardiansCreated: createdParents.length,
    })
  } catch (error) {
    console.error("[v0] Enrollment error:", error)
    return NextResponse.json({ 
      error: "Failed to complete enrollment",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// Helper function to generate admission number
async function generateAdmissionNumber(institutionId: string): Promise<string> {
  const year = new Date().getFullYear()
  
  // Count existing students for this institution this year
  const count = await prisma.student.count({
    where: {
      institutionId,
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
  })

  // Format: INST-YEAR-SEQUENCE (e.g., STD-2024-001)
  const sequence = String(count + 1).padStart(4, '0')
  return `STD-${year}-${sequence}`
}

// Helper function to generate random password
function generateRandomPassword(
  length: number,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true
): string {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numberChars = "0123456789"
  const symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?"

  let allowedChars = ""
  if (includeLowercase) allowedChars += lowercaseChars
  if (includeUppercase) allowedChars += uppercaseChars
  if (includeNumbers) allowedChars += numberChars
  if (includeSymbols) allowedChars += symbolChars

  if (allowedChars.length === 0) {
    throw new Error("At least one character type must be selected.")
  }

  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length)
    password += allowedChars[randomIndex]
  }

  return password
}

// GET endpoint to fetch enrollment status or pending enrollments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const institutionId = searchParams.get('institutionId')
    const status = searchParams.get('status') // pending, approved, enrolled
    
    if (!institutionId) {
      return NextResponse.json({ error: "Institution ID is required" }, { status: 400 })
    }

    const where: any = { institutionId }
    if (status) {
      where.enrollmentStatus = status
    }

    const enrollments = await prisma.student.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error("[v0] Fetch enrollments error:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}