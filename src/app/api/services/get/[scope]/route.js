import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/services';
import Organization from '@/models/organization';

export async function GET(request, context) {
    try {
        await connectDB();
        const { scope } = context.params; // Corrected usage
        const { searchParams } = new URL(request.url);
        const state = searchParams.get('state');
        const district = searchParams.get('district');

        console.log('Query params:', { scope, state, district });

        if (!['central', 'state', 'local'].includes(scope)) {
            return NextResponse.json(
                { error: 'Invalid scope parameter' },
                { status: 400 }
            );
        }

        // First, find organizations matching the criteria
        let orgQuery = { scope };

        if (scope === 'state' && state) {
            orgQuery.state = state;
        } else if (scope === 'local') {
            if (state) {
                orgQuery['place.district'] = state;
            }
            if (district) {
                orgQuery['place.district'] = district;
            }
        }

        console.log('Organization query:', orgQuery);
        const organizations = await Organization.find(orgQuery);
        const orgIds = organizations.map(org => org._id);

        console.log('Found organization IDs:', orgIds);

        // Then find services for these organizations
        const services = await Service.find({
            organization: { $in: orgIds }
        }).populate('organization');

        console.log('Found services count:', services.length);

        return NextResponse.json({ 
            services,
            debug: {
                orgQuery,
                orgCount: organizations.length,
                serviceCount: services.length
            }
        }, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
