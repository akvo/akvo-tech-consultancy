"""Form instance

Revision ID: b7348ae12596
Revises: 
Create Date: 2020-06-04 16:40:44.806540

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7348ae12596'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('form_instance',
                    sa.Column('id', sa.String(), server_default=sa.text('gen_random_uuid()::varchar'), nullable=False),
                    sa.Column('state', sa.String(), nullable=False),
                    sa.Column('created', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('updated', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index('form_instance_unique_state', 'form_instance', [sa.text('md5(state)')])


def downgrade():
    op.drop_index('form_instance_unique_state')
    op.drop_table('form_instance')
