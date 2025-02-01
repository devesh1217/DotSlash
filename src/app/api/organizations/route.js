import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Organization from '@/models/organization';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        
        // Get query parameters
        const scope = searchParams.get('scope');
        const state = searchParams.get('state');
        const search = searchParams.get('search');
        const district = searchParams.get('district');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 50;

        await connectDB();

        // Build query object
        let query = {};

        if (scope) {
            query.scope = scope;
        }

        if (state) {
            query.state = state;
        }

        if (district) {
            query['place.district'] = district;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        
        const [total, organizations] = await Promise.all([
            Organization.countDocuments(query),
            Organization.find(query)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit)
                .lean()
        ]);

        // Format organizations for display
        const formattedOrgs = organizations.map(org => ({
            ...org,
            displayName: formatOrgDisplayName(org)
        }));

        return NextResponse.json({
            organizations: formattedOrgs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error in organizations API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Utility function to format organization display name
function formatOrgDisplayName(org) {
    let location = '';
    
    switch (org.scope) {
        case 'central':
            location = 'Central Government';
            break;
            
        case 'state':
            location = org.state;
            break;
            
        case 'local':
            if (org.isRural) {
                location = `${org.place.village}, ${org.place.taluka}, ${org.place.district}`;
            } else {
                location = `${org.place.city}, ${org.place.district}`;
            }
            break;
    }
    
    return `${org.name} (${location})`;
}

// Handle POST requests to create new organizations
export async function POST(req) {
    try {
        const body = await req.json();
        
        // Basic validation
        if (!body.name || !body.scope) {
            return NextResponse.json(
                { error: 'Name and scope are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Additional scope-based validation
        if (!validateOrgData(body)) {
            return NextResponse.json(
                { error: 'Invalid organization data for selected scope' },
                { status: 400 }
            );
        }

        const organization = await Organization.create(body);
        
        return NextResponse.json(organization, { status: 201 });

    } catch (error) {
        console.error('Error creating organization:', error);
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Organization already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Utility function to validate organization data based on scope
function validateOrgData(data) {
    switch (data.scope) {
        case 'central':
            return true;

        case 'state':
            return !!data.state;

        case 'local':
            if (!data.place || !data.place.district) return false;
            
            if (data.isRural) {
                return !!(data.place.village && data.place.taluka);
            } else {
                return !!data.place.city;
            }

        default:
            return false;
    }
}
